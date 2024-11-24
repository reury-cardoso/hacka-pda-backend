import fetch from 'node-fetch';
import Hotel from '../models/Hotel.js';
import stringSimilarity from 'string-similarity';

const categories = {
    Resort: ["spa", "piscina","resort","praia"],
    "Hotel Fazenda": ["fazenda", "natureza", "campo", "chalés"],
    "Hostel ou Albergue": ["compartilhado", "albergue", "hostel"],
    "Flat/Apart Hotel": ["flat", "apartamento", "apart", "cozinha", "apart hotel"],
    Pousada: ["simples", "aconchegante", "acolhedor", "pousada", "inn"],
    Hotel: ["hotel"],
};

const types = [
    "resort",
    "pousada",
    "hostel",
    "fazenda",
    "farm hotel",
    "flat hotel",
    "apart hotel",
    "inn",
    "chalé",
    "albergue",
    "luxury hotel",
    "farm stay",
    "agriturismo",
    "rural retreat",
    "beach resort",
];

export const findCategoryByDescription = (description) => {
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

export const findCategory = async (hotelName, hotelDescription) => {
<<<<<<< HEAD
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

=======
    const normalizedHotelName = hotelName.toLowerCase();
>>>>>>> a7b3e9eb6d589013d16d30ffca0cd8484a36a040
    const normalizedDescription = hotelDescription ? hotelDescription.toLowerCase() : '';

    const words = normalizedHotelName.split(' ');
    for (const [category, keywords] of Object.entries(categories)) {
        for (const keyword of keywords) {
            if (words.includes(keyword)) {
                return category; 
            }
        }
    }

    const urlWithoutType = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(hotelName)}&format=json`;
    try {
        const response = await fetch(urlWithoutType);
        const data = await response.json();

        if (data && data.length > 0) {
            return "Hotel";
        }
    } catch (error) {
        console.error(`Erro ao buscar dados do hotel (consulta sem type):`, error);
    }

    for (const type of types) {
        const urlWithType = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(type)}+${encodeURIComponent(hotelName)}&format=json`;
        try {
            const response = await fetch(urlWithType);
            const data = await response.json();

            if (data && data.length > 0) {
                return type; 
            }
        } catch (error) {
            console.error(`Erro ao buscar dados do hotel para type "${type}":`, error);
        }
    }

    const categoryByDescription = findCategoryByDescription(normalizedDescription);
    if (categoryByDescription !== "Não classificado") {
        return categoryByDescription;
    }

    return 'Não classificado';
};

export const navigateData = async () => {
    try {
        const hotels = await Hotel.findAll();
        if (hotels.length === 0) {
            console.log("Nenhum dado encontrado.");
            return;
        }

        for (const hotel of hotels) {
            const category = await findCategory(hotel.name, hotel.description);

            // console.log(`${hotel.name} - Categoria: ${category}`);

            if (hotel.category !== category) {
                await hotel.update({ category });
                console.log(`Categoria do hotel "${hotel.name}" atualizada para: ${category}`);
            }
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
};

navigateData();
