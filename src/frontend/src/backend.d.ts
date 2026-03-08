import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Submission {
    name: string;
    email: string;
    company: string;
    message: string;
    phone: string;
}
export interface backendInterface {
    getAllSubmissions(): Promise<Array<Submission>>;
    submit(name: string, company: string, phone: string, email: string, message: string): Promise<void>;
}
