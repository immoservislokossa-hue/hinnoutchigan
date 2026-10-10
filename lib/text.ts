/** Normalise un intitulé de poste pour rapprocher « Président(e) » de « Président ». */
export const normalizePost = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\(e\)|\(ere\)|\(ère\)|\(trice\)/g, "")
    .replace(/[^a-z0-9]/g, "");
