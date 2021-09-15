
/**
 * Responsável por fazer as regras de negócio 
 */
class PacienteService{
    constructor({pacienteRepository}){
        this.pacienteRepository = pacienteRepository;
    }

    async find(pacienteId){
        return this.pacienteRepository.find(pacienteId);
    }

    async findName(pacienteName){
        return this.pacienteRepository.findName(pacienteName);
    }
    async create(data){
        return this.pacienteRepository.create(data);
    }

    async updateValue(paciName,values){
        return this.pacienteRepository.updateValue(paciName,values)
    }
}

module.exports = PacienteService

