// interface SignPayload {
//     userId: string;
//     sessionId: string;
//     fingerprint : {
//         ip: string;
//         userAgent: string;
//     }
//     systemRole : string
// }

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class Encrypter {
    abstract sign(payload: Record<string, unknown>): Promise<string>
    abstract refresh(payload: Record<string, unknown>): Promise<string>
}