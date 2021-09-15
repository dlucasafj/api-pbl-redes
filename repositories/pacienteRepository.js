
const {readFile, writeFile} = require ('fs/promises')

/**
 * Responsável por manipular a base de dados
 */
class PacienteRepository{
    constructor({file}){
        this.file = file
    }

    /**
     * Faz a leitura do arquivo
     * @returns 
     */
    async _currentFileContent(){
        return JSON.parse(await readFile(this.file));
    }

    /**
     * Faz a busca de um paciente por ID
     * @param {*} pacienteId 
     * @returns 
     */
    async find(pacienteId){
        const all = await this._currentFileContent(); // busca todos os pacientes do arquivo
        if(!pacienteId) return all; // retorna todos os pacientes

        return all.find(({id})=>pacienteId === id) // retorna paciente do id
    }

    /**
     * Busca de um paciente pelo nome
     * @param {*} data 
     * @returns 
     */

    async findName(pacienteName){
        const all = await this._currentFileContent();
        if(!pacienteName) return null;
        return all.find(({name})=>pacienteName ===name)   // retorna paciente pelo nome
    }

    /**
     * Cria um novo paciente
     */
    async create(data){
        const currentFile = await this._currentFileContent() // busca todo o array
        currentFile.push(data); // adiciona um novo paciente no array

        await writeFile(this.file, JSON.stringify(currentFile)) // sobrescreve todo o conteudo do array com o array atualizado
   
        return data.id;
     }

     /**
      * Atualizar os equipamentos de um paciente
      * @param {} pacienteName 
      * @param {*} paciente 
      */
    async updateValue(pacienteName,paciente){
        const currentFile = await this._currentFileContent();
       currentFile.find(({name})=>pacienteName===name).equipamento = paciente.equipamento
       currentFile.find(({name})=>pacienteName===name).sistolica = paciente.sistolica
       currentFile.find(({name})=>pacienteName===name).diastolica = paciente.diastolica
       currentFile.find(({name})=>pacienteName===name).temperatura = paciente.temperatura




        await writeFile(this.file,JSON.stringify(currentFile))
        return "sucesso"
    }

}

module.exports= PacienteRepository

/* 
const paciente = new PacienteRepository({
    file: './../../database/data.json'
}) */
// paciente.create({id:2, name:"Paulo", equipamento:[{id: 1, nome:"oximetro c", value: 20}]}).then(console.log).catch(error=>console.log("error", error));

//  paciente.find(1).then(console.log).catch(error => console.log("error",error))