import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
	// Authentication
	generateAuthenticationOptions,
	// Registration
	generateRegistrationOptions,
	verifyAuthenticationResponse,
	verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
	GenerateAuthenticationOptionsOpts,
	GenerateRegistrationOptionsOpts,
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
    PublicKeyCredentialRequestOptionsJSON
} from '@simplewebauthn/types';

const rpID = 'localhost'

@Injectable()
export class PasskeyService {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    public async generateRegistrationOption(userId: string): Promise<PublicKeyCredentialCreationOptionsJSON> {
        // TODO: Get user data from userId
        const userEmail = 'example@email.com'

		const options = await generateRegistrationOptions({
			rpName: 'Nillion Passkey Demo',
			rpID: rpID,
			userID: Buffer.from(userId),
			userName: userEmail,
			timeout: 60000,
			attestationType: 'direct',
			excludeCredentials: [],
			authenticatorSelection: {
				residentKey: 'preferred',
			},
			supportedAlgorithmIDs: [-8],
		});

		await this.cacheManager.set(userId, options.challenge);
		return options;
	}

	public async verifyRegistration(userId: string, credential: RegistrationResponseJSON): Promise<boolean> {
		const expectedChallenge = await this.cacheManager.get<string>(userId);

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
            // const existingDevice = user.devices.find((device) => device.credentialID === credentialID);

            // if (!existingDevice) {
            //     /**
            //      * Add the returned device to the user's list of devices
            //      */
            //     const newDevice: AuthenticatorDevice = {
            //         credentialPublicKey,
            //         credentialID,
            //         counter,
            //         transports: body.response.transports,
            //     };
            //     user.devices.push(newDevice);
            // }
        }

        await this.cacheManager.del(userId.toString());

        return verified;
    }

    public async generateAuthenticationOption(userId: string): Promise<PublicKeyCredentialRequestOptionsJSON> {
        // TODO: Get user data from userId
        const user;

        const opts: GenerateAuthenticationOptionsOpts = {
            timeout: 60000,
            allowCredentials: user.devices.map((dev) => ({
                id: dev.credentialID,
                type: 'public-key',
                transports: dev.transports,
            })),
            /**
             * Wondering why user verification isn't required? See here:
             *
             * https://passkeys.dev/docs/use-cases/bootstrapping/#a-note-about-user-verification
             */
            userVerification: 'preferred',
            rpID,
        };

        const options = await generateAuthenticationOptions(opts);
        await this.cacheManager.set(userId, options.challenge);

        return options;
    }

    public async verifyAuthentication(userId: string, credential: AuthenticationResponseJSON): Promise<boolean> {
        // TODO: Get user data from userId
        const user;

        const expectedChallenge = await this.cacheManager.get<string>(userId);

        let dbAuthenticator;
        // "Query the DB" here for an authenticator matching `credentialID`
        // TODO: Get device by userId and credentialID
        for (const dev of user.devices) {
            if (dev.credentialID === credential.id) {
                dbAuthenticator = dev;
                break;
            }
        }
        if (!dbAuthenticator) return false;

        let verification: VerifiedAuthenticationResponse;
        try {
            const opts: VerifyAuthenticationResponseOpts = {
                response: credential,
                expectedChallenge: `${expectedChallenge}`,
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
            // TODO: Update the authenticator's counter in the DB to the newest count in the authentication
            dbAuthenticator.counter = authenticationInfo.newCounter;
        }

        return verified;
    }
}
