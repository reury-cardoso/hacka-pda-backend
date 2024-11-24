import fetch from 'node-fetch';
import Hotel from './models/Hotel.js';

const buscarCategoria = async (nomeHotel, categorias) => {
    for (let i = 0; i < categorias.length; i++) {
        const tipo = categorias[i];
        const url = `https://nominatim.openstreetmap.org/search?q="${encodeURIComponent(tipo)}+${encodeURIComponent(nomeHotel)}"&format=json`;

        // console.log(`Consultando: ${url}`); // Log da URL para depuração

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                return tipo.charAt(0).toUpperCase() + tipo.slice(1);
            }
        } catch (error) {
            console.error(`Erro ao buscar categoria ${tipo}:`, error);
        }
    }
    const urlHotel = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeHotel)}&format=json`;

    // console.log(`Consultando hotel: ${urlHotel}`); 

    const responseHotel = await fetch(urlHotel);
    const dataHotel = await responseHotel.json();
    if (dataHotel && dataHotel.length > 0) {
        return "Hotel"; 
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
            'apart hotel',
            'inn',
            'chalé',
            'albergue',
            'luxury hotel',
            'farm stay',
            'agriturismo',
            'rural retreat',
            'beach resort',
        ];

        for (const hotel of hotéis) {
            const categoria = await buscarCategoria(hotel.name, categorias);

            console.log(`${hotel.name} - Categoria: ${categoria}`);

            // Aqui você pode salvar ou atualizar o hotel com a categoria
            // await hotel.update({ categoria });
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
};

navegarDados();

