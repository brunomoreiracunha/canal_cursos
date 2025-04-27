import * as fs from 'fs';
import * as path from 'path';

export function updateDataFile(fileName: string, data: any) {
  try {
    // Constrói o caminho absoluto para o arquivo
    const filePath = path.join(process.cwd(), 'src', 'data', fileName);
    
    // Lê o conteúdo atual do arquivo
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Encontra o início da exportação do array
    const exportMatch = fileContent.match(/export const [a-zA-Z]+ =/);
    if (!exportMatch) throw new Error(`Não foi possível encontrar a exportação no arquivo ${fileName}`);
    
    const startIndex = fileContent.indexOf(exportMatch[0]);
    if (startIndex === -1) throw new Error(`Não foi possível encontrar o início do array em ${fileName}`);
    
    // Encontra o final do array (procura por '];')
    const endIndex = fileContent.indexOf('];', startIndex) + 2;
    if (endIndex === 1) throw new Error(`Não foi possível encontrar o final do array em ${fileName}`);
    
    // Converte os dados para string mantendo a formatação
    const arrayString = JSON.stringify(data, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Remove aspas das chaves
      .replace(/^(\[)/, `${exportMatch[0]} [`) // Adiciona a declaração de exportação
      .replace(/\]$/, '];'); // Adiciona ponto e vírgula no final
    
    // Cria o novo conteúdo do arquivo
    const newContent = fileContent.slice(0, startIndex) + arrayString + fileContent.slice(endIndex);
    
    // Salva o arquivo
    fs.writeFileSync(filePath, newContent, 'utf-8');
    
    console.log(`Arquivo ${fileName} atualizado com sucesso!`);
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar arquivo ${fileName}:`, error);
    return false;
  }
}
