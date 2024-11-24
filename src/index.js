import fetch from 'node-fetch';
import Hotel from './models/Hotel.js';
import stringSimilarity from 'string-similarity';

const categories = {
    Resort: ["spa", "piscina", "resort", "praia"],
    "Hotel Fazenda": ["fazenda", "natureza", "campo", "chalés"],
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


const buscarCategoria = async (nomeHotel, categorias, segundaCategoria, descricao) => {
    const normalizedHotelName = nomeHotel.toLowerCase();

    const words = normalizedHotelName.split(' ');
    for (const [category, keywords] of Object.entries(categories)) {
        for (const keyword of keywords) {
            if (words.includes(keyword)) {
                return category;
            }
        }
    }

    for (let i = 0; i < categorias.length; i++) {
        const tipo = categorias[i];
        const segundoTipo = segundaCategoria[i];
        const url = `https://nominatim.openstreetmap.org/search?q="${encodeURIComponent(tipo)}+${encodeURIComponent(nomeHotel)}"&format=json`;
        const urlSegundaCategoria = `https://nominatim.openstreetmap.org/search?q="${encodeURIComponent(segundoTipo)}+${encodeURIComponent(nomeHotel)}"&format=json`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const segundoResponse = await fetch(urlSegundaCategoria);
            const segundaData = await segundoResponse.json();

            if (data && data.length > 0) {
                return tipo.charAt(0).toUpperCase() + tipo.slice(1);
            }

            if (segundaData && segundaData.length > 0) {
                return segundoTipo.charAt(0).toUpperCase() + segundoTipo.slice(1);
            }
        } catch (error) {
            console.error(`Erro ao buscar categoria ${tipo}:`, error);
        }
    }

     const urlWithoutType = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeHotel)}&format=json`;
     try {
         const response = await fetch(urlWithoutType);
         const data = await response.json();
         if (data && data.length > 0) {
             return "Hotel";
         }
     } catch (error) {
         console.error(`Erro ao buscar dados do hotel (consulta sem type):`, error);
     }


    const categoryByDescription = findCategoryByDescription(descricao);
    if (categoryByDescription !== "Não classificado") {
        return categoryByDescription;
    }

    return 'Não classificado';
};

const navegarDados = async () => {
    try {
        const hotéis = await Hotel.findAll();
        if (hotéis.length === 0) {
            console.log("Nenhum dado encontrado.");
            return;
        }

        const categorias = [
            'resort',
            'pousada',
            'hostel',
            'fazenda',
            'farm hotel',
            'flat hotel',
            'apart hotel'
        ];
        const segundaCategoria = [
            'inn',
            'chalé',
            'albergue',
            'luxury hotel',
            'farm stay',
            'agriturismo',
            'beach resort',
        ];

        for (const hotel of hotéis) {
            const categoria = await buscarCategoria(hotel.name, categorias, segundaCategoria, hotel.description);
            
            await hotel.update({ category: categoria });
            console.log(`${hotel.name} - Categoria: ${categoria}`);
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
};

navegarDados();