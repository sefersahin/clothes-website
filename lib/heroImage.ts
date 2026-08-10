function withTransform(url: string, transform: string): string {
  return url.replace("/upload/", `/upload/${transform}/`);
}

export function desktopUrl(url: string): string {
  return withTransform(url, "ar_16:9,c_fill,g_auto,w_1920,q_auto,f_auto");
}

export function mobileUrl(url: string): string {
  return withTransform(url, "ar_4:5,c_fill,g_auto,w_800,q_auto,f_auto");
}
