interface IBleError extends Error {
    errCode: number;
}
export default function getErrorMsg(err: IBleError): string;
export {};
