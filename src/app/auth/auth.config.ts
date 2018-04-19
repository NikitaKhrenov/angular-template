import { ENV } from './../core/env.config';

interface AuthConfig {
    CLIENT_ID: string;
    AUDIENCE: string;
    REDIRECT: string;
    SCOPE: string;
}

export const AUTH_CONFIG: AuthConfig = {
    CLIENT_ID: 'browser',
    AUDIENCE: `${ENV.BASE_API}`,
    REDIRECT: `${ENV.BASE_URI}/callback`,
    SCOPE: 'ui'
};
