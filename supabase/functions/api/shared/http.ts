export const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export const response = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

export const envelope = (data: Record<string, unknown>) => ({
  success: true,
  code: 200,
  messageCode: "success.common.loaded",
  data,
  timestamp: Date.now(),
});

export const now = () => Date.now();

export const apiError = (
  status: number,
  errorCode: string,
  messageCode: string,
) =>
  response(status, {
    success: false,
    code: status,
    errorCode,
    messageCode,
    data: null,
    timestamp: now(),
  });
