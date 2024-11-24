import fetch from 'node-fetch';
import Hotel from './models/Hotel.js';
import stringSimilarity from 'string-similarity';

const categories = {
    Resort: ["luxo", "spa", "piscina", "cinco estrelas", "resort"],
    "Hotel Fazenda": ["fazenda", "natureza", "campo", "fazenda"],
    "Hostel ou Albergue": ["compartilhado", "albergue", "hostel"],
    "Flat/Apart Hotel": ["flat", "apartamento", "apart", "cozinha", "apart hotel"],
    Pousada: ["simples", "aconchegante", "acolhedor", "pousada", "inn"],
    Hotel: ["hotel"],
};

const findCategoryByDescription = (description) => {
    const normalizedDescription = description ? description.toLowerCase() : '';

    let bestMatch = { rating: 0, category: "Não classificado" };

    for (const [category, keywords] of Object.entries(categories)) {
        let categoryMatchScore = 0;

        for (const keyword of keywords) {
            if (normalizedDescription.includes(keyword)) {
                return category; 
            }
            categoryMatchScore += stringSimilarity.compareTwoStrings(normalizedDescription, keyword);
        }

        if (categoryMatchScore > bestMatch.rating) {
            bestMatch = { rating: categoryMatchScore, category };
        }
    }

    return bestMatch.category;
};

const findCategory = async (hotelName, hotelDescription) => {
    const urlHotel = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(hotelName)}&format=json`;

    const normalizedHotelName = hotelName.toLowerCase();

    try {
        const responseHotel = await fetch(urlHotel);
        const dataHotel = await responseHotel.json();
        if (dataHotel && dataHotel.length > 0) {
            return "Hotel"; 
        }
    } catch (error) {
        console.error('Erro ao buscar dados do hotel:', error);
    }

    const normalizedDescription = hotelDescription ? hotelDescription.toLowerCase() : '';
    const words = normalizedHotelName.split(' ');

    for (const [category, keywords] of Object.entries(categories)) {
        for (const keyword of keywords) {
            if (words.includes(keyword)) {
                return category; 
            }
        }
    }

    const categoryByDescription = findCategoryByDescription(normalizedDescription);
    if (categoryByDescription !== "Não classificado") {
        return categoryByDescription; 
    }

    return 'Não classificado';
};

const navigateData = async () => {
    try {
        const hotels = await Hotel.findAll(); 
        if (hotels.length === 0) {
            console.log("Nenhum dado encontrado.");
            return;
        }

        for (const hotel of hotels) {
            const category = await findCategory(hotel.name, hotel.description);

            console.log(`${hotel.name} - Categoria: ${category}`);

            // Aqui você pode salvar ou atualizar o hotel com a categoria
            // await hotel.update({ category });
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
};

navigateData();