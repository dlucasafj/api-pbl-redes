const PacienteRepository = require('./../repositories/pacienteRepository.js')
const PacienteService   = require('./../services/pacienteService.js')

const {join} = require('path');

const fileName = join(__dirname,'./../database',"data.json");

const generateInstace =  ()=>{

    const pacienteRepository = new PacienteRepository({
        file:fileName
    });

    const pacienteService = new PacienteService({pacienteRepository})
    
    return pacienteService;

}

module.exports={generateInstace}


// const paci = generateInstace();
// paci.find(1).then(response => {console.log(response.equipamento)});