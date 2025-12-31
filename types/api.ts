export interface Tree {
  id: number;
  common_name: string;
  status: string;
  image_url: string | null;
  family: string | null;
  genus: string | null;
}

export interface TreesApiResponse {
  data: Tree[];
}

export interface CatGifResponse {
  url: string;
}
