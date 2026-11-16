import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  obterVotos,
  calcularResultado,
  desfazerUltimoVoto,
  zerarVotos,
} from '../services/votacaoService';

// "1 voto", "2 votos"
function plural(qtd) {
  return `${qtd} ${qtd === 1 ? 'voto' : 'votos'}`;
}

function Resultado() {
  const [votos, setVotos] = useState(() => obterVotos());

  // Valores derivados
  const total = votos.length;
  const resultado = calcularResultado(votos);
  const craque = resultado[0]; // 1º colocado
  const vice = resultado[1]; // 2º colocado
  const vantagem = craque.votos - vice.votos;

  function handleDesfazer() {
    setVotos(desfazerUltimoVoto());
  }

  function handleZerar() {
    if (window.confirm('Apagar todos os votos?')) {
      zerarVotos();
      setVotos([]);
    }
  }

  return (
    <main className="pagina">
      <h1>Parcial: Craque do Jogo</h1>
      <p className="total-votos">
        <strong>{total}</strong> {total === 1 ? 'voto computado' : 'votos computados'}
      </p>

      {total === 0 ? (
        <div className="sem-votos">
          <p>Nenhum voto ainda. Escolha o craque do jogo para ver a parcial.</p>
          <Link to="/votacao" className="botao botao-principal">Ir para a votação</Link>
        </div>
      ) : (
        <>
          <p className="disputa">
            {vantagem === 0
              ? `Empate na liderança entre ${craque.nome} e ${vice.nome}!`
              : `${craque.nome} lidera com ${plural(vantagem)} de vantagem sobre ${vice.nome}.`}
          </p>

          <ol className="placar">
            {resultado.map((j, i) => (
              <li
                key={j.id}
                className={`placar-item${i === 0 ? ' placar-craque' : ''}${i === 1 ? ' placar-vice' : ''}`}
              >
                <span className="placar-posicao">{i + 1}º</span>
                <img src={j.foto} alt={j.nome} className="placar-foto" />
                <div className="placar-dados">
                  <h3>
                    {j.nome}
                    {i === 0 && <span className="placar-selo">Craque do jogo</span>}
                    {i === 1 && <span className="placar-selo">Vice</span>}
                  </h3>
                  <div className="barra">
                    <div className="barra-preenchida" style={{ width: `${j.percentual}%` }} />
                  </div>
                  <p className="placar-numeros">
                    {j.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% ({plural(j.votos)})
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="resultado-acoes">
            <button type="button" className="botao botao-claro" onClick={handleDesfazer}>
              Desfazer último voto
            </button>
            <button type="button" className="botao botao-contorno" onClick={handleZerar}>
              Zerar votação
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default Resultado;
