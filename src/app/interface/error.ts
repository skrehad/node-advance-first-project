export type TErrorSources = {
  path: string | number;
  message: string;
}[];

// aita hoise kew jeno vul error na pathaite pare mane onno developer jodi ai site niye arekta githup repote kaj kore ar vul val error patay taile jeno na ney
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
