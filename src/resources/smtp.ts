import type { HttpClient } from '../client.js'
import type {
  CreateSmtpCredentialParams,
  CreateSmtpCredentialResponse,
  PaginatedResponse,
  RotateSmtpCredentialResponse,
  SmtpCredential,
} from '../types.js'

/**
 * SMTP relay credential management
 */
export class Smtp {
  constructor(private readonly http: HttpClient) {}

  /**
   * List SMTP credentials (passwords are never returned)
   *
   * @example
   * ```typescript
   * const { data } = await client.smtp.listCredentials();
   * for (const cred of data) {
   *   console.log(`${cred.username}: ${cred.status}`);
   * }
   * ```
   */
  async listCredentials(): Promise<PaginatedResponse<SmtpCredential>> {
    return this.http.get<PaginatedResponse<SmtpCredential>>('/v1/smtp/credentials')
  }

  /**
   * Create a new SMTP credential.
   * The password is returned only once in the response -- store it securely.
   *
   * @example
   * ```typescript
   * const credential = await client.smtp.createCredential({
   *   name: 'Production SMTP',
   * });
   * console.log(credential.username); // 'veil_smtp_abc123'
   * console.log(credential.password); // shown only once
   * console.log(credential.smtpHost); // 'smtp.veilmail.xyz'
   * ```
   */
  async createCredential(params: CreateSmtpCredentialParams): Promise<CreateSmtpCredentialResponse> {
    return this.http.post<CreateSmtpCredentialResponse>('/v1/smtp/credentials', params)
  }

  /**
   * Get an SMTP credential by ID (password is never returned)
   *
   * @example
   * ```typescript
   * const credential = await client.smtp.getCredential('cred_xxxxx');
   * ```
   */
  async getCredential(id: string): Promise<SmtpCredential> {
    return this.http.get<SmtpCredential>(`/v1/smtp/credentials/${id}`)
  }

  /**
   * Revoke an SMTP credential
   *
   * @example
   * ```typescript
   * await client.smtp.revokeCredential('cred_xxxxx');
   * ```
   */
  async revokeCredential(id: string): Promise<void> {
    await this.http.delete<void>(`/v1/smtp/credentials/${id}`)
  }

  /**
   * Rotate the password for an SMTP credential.
   * The new password is returned only once -- store it securely.
   *
   * @example
   * ```typescript
   * const result = await client.smtp.rotatePassword('cred_xxxxx');
   * console.log(result.password); // new password, shown only once
   * ```
   */
  async rotatePassword(id: string): Promise<RotateSmtpCredentialResponse> {
    return this.http.post<RotateSmtpCredentialResponse>(`/v1/smtp/credentials/${id}/rotate`)
  }
}
