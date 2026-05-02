export const portfolioCategories = [
  "Interier",
  "Arkitekturë",
  "Lokale",
  "Rendera 3D",
  "Renovim",
  "Banesa në shitje",
] as const;

export const allPortfolioCategoriesLabel = "Të gjitha";

export const portfolioCategorySlugs: Record<(typeof portfolioCategories)[number], string> = {
  Interier: "interier",
  Arkitekturë: "arkitekture",
  Lokale: "lokale",
  "Rendera 3D": "rendera-3d",
  Renovim: "renovim",
  "Banesa në shitje": "banesa-ne-shitje",
};
