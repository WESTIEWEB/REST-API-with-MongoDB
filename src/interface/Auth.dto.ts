import { type } from 'os';
import { vendorPayload } from './vendor';
import {userPayload} from './users';

export type AuthPayload = vendorPayload | userPayload;