import React, { useState } from 'react'; // Importa React e useState
import './App.css'; // Importa os estilos do CSS

function App() {
  // Define os estados do componente
  const [items, setItems] = useState([]); // Estado para armazenar os itens no carrinho
  const [newItem, setNewItem] = useState(''); // Estado para armazenar o novo item a ser adicionado
  const [newQuantity, setNewQuantity] = useState(1); // Estado para armazenar a quantidade do novo item
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar se está editando um item
  const [currentItemIndex, setCurrentItemIndex] = useState(null); // Índice do item sendo editado
  const [searchTerm, setSearchTerm] = useState(''); // Estado para armazenar o termo de busca
  const [receipt, setReceipt] = useState(null); // Estado para armazenar o comprovante
  const [error, setError] = useState(null); // Estado para mensagens de erro gerais
  const [itemError, setItemError] = useState(null); // Estado para erro ao adicionar item

  // Função para adicionar um novo item ao carrinho
  const handleAddItem = () => {
    // Valida se o nome do item e a quantidade são válidos
    if (newItem.trim() === '' || newQuantity <= 0) {
      setItemError('Por favor, insira um nome de item válido.'); // Define mensagem de erro
      return; // Sai da função se houver erro
    }
    
    setItemError(null); // Limpa o erro se tudo estiver certo

    const existingItem = items.find((item) => item.name === newItem); // Verifica se o item já existe
    // Se o item já existe e não está em modo de edição, atualiza a quantidade
    if (existingItem && !isEditing) {
      setItems(
        items.map((item) =>
          item.name === newItem
            ? { ...item, quantity: item.quantity + newQuantity } // Aumenta a quantidade do item
            : item
        )
      );
    } else if (isEditing && currentItemIndex !== null) {
      // Se está editando, atualiza o item na posição correta
      const updatedItems = [...items];
      updatedItems[currentItemIndex] = { name: newItem, quantity: newQuantity };
      setItems(updatedItems); // Atualiza os itens no estado
      setIsEditing(false); // Sai do modo de edição
      setCurrentItemIndex(null); // Reseta o índice atual
    } else {
      // Se o item não existe, adiciona um novo item
      setItems([...items, { name: newItem, quantity: newQuantity }]);
    }
    setNewItem(''); // Limpa o campo do novo item
    setNewQuantity(1); // Reseta a quantidade para 1
  };

  // Função para remover um item do carrinho
  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((item, i) => i !== index); // Filtra o item que será removido
    setItems(updatedItems); // Atualiza os itens no estado
  };

  // Função para atualizar a quantidade de um item
  const handleUpdateQuantity = (index, quantity) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, quantity: quantity } : item // Atualiza a quantidade do item específico
    );
    setItems(updatedItems); // Atualiza os itens no estado
  };

  // Função para editar um item existente
  const handleEditItem = (index) => {
    const originalIndex = items.findIndex((item) => filteredItems[index].name === item.name);
    setIsEditing(true); // Ativa o modo de edição
    setCurrentItemIndex(originalIndex); // Define o índice do item sendo editado
    setNewItem(items[originalIndex].name); // Preenche o campo de novo item com o nome do item a ser editado
    setNewQuantity(items[originalIndex].quantity); // Preenche o campo de quantidade com a quantidade do item a ser editado
  };

  // Função para finalizar a compra e exibir o comprovante ou erro
  const handleFinalizePurchase = () => {
    if (items.length === 0) {
      setError('Nenhum item encontrado no carrinho'); // Define mensagem de erro se não houver itens
      setReceipt(null); // Limpa o comprovante se houver erro
    } else {
      const totalItems = items.reduce((acc, item) => acc + item.quantity, 0); // Calcula o total de itens
      const receiptDetails = items.map(
        (item) => `${item.name} - Qtd:  ${item.quantity}` // Cria detalhes do comprovante
      );
      setReceipt({
        items: receiptDetails, // Define os itens do comprovante
        totalItems: totalItems, // Define total de itens no comprovante
      });
      setError(null); // Limpa o erro se a compra for finalizada
    }
  };

  // Função para fechar o comprovante ou mensagem de erro
  const handleCloseModal = () => {
    setReceipt(null); // Limpa o comprovante
    setError(null); // Limpa a mensagem de erro
  };

  // Filtra itens com base no termo de busca
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filtra itens que contêm o termo de busca
  );

  // Renderização do componente
  return (
    <div className="App">
      <h1>Carrinho de Compras</h1>

      {/* Exibir mensagem de erro ao adicionar item */}
      {itemError && <div className="error-message">{itemError}</div>}

      {/* Adicionar novo item */}
      <div className="container">
        <input
          type="text"
          value={newItem} // Valor do novo item
          onChange={(e) => setNewItem(e.target.value)} // Atualiza o estado ao digitar
          placeholder="Digite o nome do item..."
        />
        <input
          type="number"
          min="1"
          value={newQuantity} // Valor da quantidade do novo item
          onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)} // Garante que sempre haja um valor
          placeholder="Quantidade"
        />
        <button onClick={handleAddItem}> 
          {isEditing ? 'Salvar Edição' : 'Adicionar Item'} 
        </button>
      </div>

      {/* Consulta de item instantânea */}
      <div className="container">
        <input
          type="text"
          value={searchTerm} // Valor do campo de busca
          onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado ao digitar
          placeholder="Digite o nome do item para consultar..."
        />
      </div>

      {/* Exibir os resultados da consulta */}
      {filteredItems.length > 0 ? (
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>
              {item.name} - Qtd: 
              <input
                type="number"
                min="1"
                value={item.quantity} // Valor da quantidade do item
                onChange={(e) =>
                  handleUpdateQuantity(
                    items.findIndex((origItem) => origItem.name === item.name), // Encontra o índice do item original
                    parseInt(e.target.value) // Atualiza a quantidade
                  )
                }
              />
              <button onClick={() => handleEditItem(index)}>Editar</button>
              <button
                onClick={() =>
                  handleRemoveItem(items.findIndex((origItem) => origItem.name === item.name)) // Remove o item pelo índice
                }
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      ) : (
        searchTerm && <p>Item não encontrado</p> // Mensagem se nenhum item for encontrado
      )}

      {/* Exibir todos os itens se não houver consulta */}
      {filteredItems.length === 0 && !searchTerm && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name} - Qtd: 
              <input
                type="number"
                min="1"
                value={item.quantity} // Valor da quantidade do item
                onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value))} // Atualiza a quantidade do item
              />
              <button onClick={() => handleEditItem(index)}>Editar</button>
              <button onClick={() => handleRemoveItem(index)}>Remover</button>
            </li>
          ))}
        </ul>
      )}

      {/* Botão para finalizar a compra */}
      <button className="finalize-button" onClick={handleFinalizePurchase}>
        Finalizar Compra
      </button>

      {/* Modal para exibir o comprovante ou mensagem de erro */}
      {(receipt || error) && (
        <div className="modal">
          <div className="modal-content">
            {receipt ? (
              <>
                <h2>Comprovante de Compra</h2>
                <ul>
                  {receipt.items.map((item, index) => (
                    <li key={index}>{item}</li> // Exibe os itens do comprovante
                  ))}
                </ul>
                <p>Total de itens: {receipt.totalItems}</p> 
              </>
            ) : (
              <p>{error}</p> // Exibe mensagem de erro
            )}
            <button onClick={handleCloseModal}>Fechar</button> 
          </div>
        </div>
      )}
    </div>
  );
}

export default App; // Exporta o componente App
