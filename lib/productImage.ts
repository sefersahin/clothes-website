function withTransform(url: string, transform: string): string {
  return url.replace("/upload/", `/upload/${transform}/`);
}

export function thumbnailUrl(url: string): string {
  return withTransform(url, "w_400,c_limit,q_auto,f_auto");
}

export function fullImageUrl(url: string): string {
  return withTransform(url, "w_1600,c_limit,q_auto,f_auto");
}

export function shapeImage(image: { id: string; imageUrl: string; sortOrder: number }) {
  return {
    id: image.id,
    sortOrder: image.sortOrder,
    url: fullImageUrl(image.imageUrl),
    thumbnailUrl: thumbnailUrl(image.imageUrl),
  };
}
