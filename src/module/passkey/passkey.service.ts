import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
	generateAuthenticationOptions,
	generateRegistrationOptions,
	verifyAuthenticationResponse,
	verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
	GenerateAuthenticationOptionsOpts,
	VerifiedAuthenticationResponse,
	VerifiedRegistrationResponse,
	VerifyAuthenticationResponseOpts,
	VerifyRegistrationResponseOpts,
} from '@simplewebauthn/server';

import type {
	AuthenticationResponseJSON,
	AuthenticatorDevice,
	RegistrationResponseJSON,
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialRequestOptionsJSON,
	AuthenticatorTransportFuture,
} from '@simplewebauthn/types';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Passkey } from './entities/passkey.entity';
import { runQuery } from 'src/share/util/helper.util';

const rpID = 'localhost';

@Injectable()
export class PasskeyService {
	constructor(
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		@InjectRepository(Passkey)
		private readonly passkeyModel: Repository<Passkey>,
	) {}

	public async generateRegistrationOption(user: User): Promise<PublicKeyCredentialCreationOptionsJSON> {
		const options = await generateRegistrationOptions({
			rpName: 'Nillion Passkey Demo',
			rpID: rpID,
			userID: Buffer.from(user.id.toString()),
			userName: user.email,
			timeout: 60000,
			attestationType: 'direct',
			excludeCredentials: [],
			authenticatorSelection: {
				residentKey: 'preferred',
			},
			supportedAlgorithmIDs: [-8],
		});

		await this.cacheManager.set(`REGISTRATION-${user.id.toString()}`, options.challenge);
		return options;
	}

	public async verifyRegistration(user: User, credential: RegistrationResponseJSON): Promise<boolean> {
		const expectedChallenge = await this.cacheManager.get<string>(`REGISTRATION-${user.id.toString()}`);

		let verification: VerifiedRegistrationResponse;
		try {
			const opts: VerifyRegistrationResponseOpts = {
				response: credential,
				expectedChallenge: `${expectedChallenge}`,
				expectedOrigin: '',
				expectedRPID: rpID,
				requireUserVerification: false,
			};
			verification = await verifyRegistrationResponse(opts);
		} catch (error) {
			const _error = error as Error;
			console.error(_error);
			return false;
		}

		const { verified, registrationInfo } = verification;

		if (verified && registrationInfo) {
			const { credentialPublicKey, credentialID, counter } = registrationInfo;
			const existingDevice = await this.passkeyModel.findOne({
				where: { internal_user_id: user.id, cred_id: credentialID },
			});
			if (!existingDevice) {
				await runQuery(async (queryRunner: QueryRunner) => {
					const newDevice: Passkey = this.passkeyModel.create({
						cred_id: credentialID,
						cred_public_key: credentialPublicKey,
						internal_user_id: user.id,
						counter: counter,
						transports: credential.response.transports.join('|'),
					});

					await queryRunner.manager.save(newDevice);
				});
			}
		}

		await this.cacheManager.del(`REGISTRATION-${user.id.toString()}`);

		return verified;
	}

	public async generateAuthenticationOption(user: User): Promise<PublicKeyCredentialRequestOptionsJSON> {
		const devices = await this.passkeyModel.find({
			where: { internal_user_id: user.id },
		});
		if (!devices || devices.length === 0) throw Error('Not found passkey device');

		const opts: GenerateAuthenticationOptionsOpts = {
			timeout: 60000,
			allowCredentials: devices.map((dev) => ({
				id: dev.cred_id,
				type: 'public-key',
				transports: dev.transports.split('|') as AuthenticatorTransportFuture[],
			})),
			userVerification: 'preferred',
			rpID,
		};

		const options = await generateAuthenticationOptions(opts);
		await this.cacheManager.set(`AUTHENTICATION-${user.id.toString()}`, options.challenge);

		return options;
	}

	public async verifyAuthentication(user: User, credential: AuthenticationResponseJSON): Promise<boolean> {
		const expectedChallenge = await this.cacheManager.get<string>(`AUTHENTICATION-${user.id.toString()}`);

		const device = await this.passkeyModel.findOne({ where: { internal_user_id: user.id, cred_id: credential.id } });
		if (!device) return false;

		const dbAuthenticator: AuthenticatorDevice = {
			credentialID: device.cred_id,
			credentialPublicKey: device.cred_public_key,
			counter: device.counter,
			transports: device.transports.split('|') as AuthenticatorTransportFuture[],
		};

		let verification: VerifiedAuthenticationResponse;
		try {
			const opts: VerifyAuthenticationResponseOpts = {
				response: credential,
				expectedChallenge,
				expectedOrigin: '',
				expectedRPID: rpID,
				authenticator: dbAuthenticator,
				requireUserVerification: false,
			};
			verification = await verifyAuthenticationResponse(opts);
		} catch (error) {
			const _error = error as Error;
			console.error(_error);
			return false;
		}

		const { verified, authenticationInfo } = verification;
		if (verified) {
			device.counter = authenticationInfo.newCounter;
			await this.passkeyModel.save(device);
		}

		await this.cacheManager.del(`AUTHENTICATION-${user.id.toString()}`);

		return verified;
	}
}
