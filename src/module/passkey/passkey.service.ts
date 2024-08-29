import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from "cache-manager";
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
    PublicKeyCredentialCreationOptionsJSON
} from '@simplewebauthn/types';

@Injectable()
export class PasskeyService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    public async generateRegistrationOption(userId: string): Promise<PublicKeyCredentialCreationOptionsJSON> {
        const rpID = 'localhost'
        // const userId = Buffer.from("83c206d6-1dfc-4809-8f89-0dc1a63807d3");
        const userEmail = 'example@email.com'

        const options = await generateRegistrationOptions({
            rpName: "Nillion Passkey Demo",
            rpID: rpID,
            userID: Buffer.from(userId),
            userName: userEmail,
            timeout: 60000,
            attestationType: "direct",
            excludeCredentials: [],
            authenticatorSelection: {
                residentKey: "preferred",
            },
            supportedAlgorithmIDs: [-8],
        });


        await this.cacheManager.set(userId, options.challenge);
        return options;
    }

    public async verifyRegistration(userId: string, credential: RegistrationResponseJSON): Promise<boolean> {
        const rpID = 'localhost'
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

        return true;
    }


}

