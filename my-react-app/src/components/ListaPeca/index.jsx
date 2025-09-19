import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Divider, Paper } from "@mui/material";
const STORAGE_KEY = "pecas_lista_v1";

const ListaPeca = () => {
  const [lista, setLista] = useState([]);
  const [filtroTonalidade, setFiltroTonalidade] = useState("");

  // carregar peças do localStorage ao montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLista(parsed);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar lista:", err);
    }
  }, []);

  // filtrar por tonalidade
  const listaFiltrada = lista.filter((p) =>
    p.tonalidade.toLowerCase().includes(filtroTonalidade.toLowerCase())
  );

  // limpar filtro
  const limparFiltro = () => setFiltroTonalidade("");

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Typography variant="h5" mt={2}>
        Listagem de Peças
      </Typography>

      {/* Campo de filtro */}
      <Box display="flex" gap={2} my={3}>
        <TextField
          label="Filtrar por tonalidade"
          value={filtroTonalidade}
          onChange={(e) => setFiltroTonalidade(e.target.value)}
        />
        <Button variant="outlined" onClick={limparFiltro}>
          Limpar
        </Button>
      </Box>

      {/* Lista */}
      {listaFiltrada.length === 0 ? (
        <Typography color="textSecondary">
          Nenhuma peça encontrada {filtroTonalidade && `(filtro: ${filtroTonalidade})`}
        </Typography>
      ) : (
        <Box width="80%" maxWidth={800}>
          {listaFiltrada.map((peca) => (
            <Paper key={peca.id} sx={{ p: 2, mb: 2 }}>
              <Typography><strong>Etiqueta:</strong> {peca.etiqueta}</Typography>
              <Typography><strong>Artigo:</strong> {peca.artigo}</Typography>
              <Typography><strong>Tonalidade:</strong> {peca.tonalidade}</Typography>
              <Typography><strong>Peso:</strong> {peca.peso}</Typography>
              <Typography variant="caption" color="textSecondary">
                Salvo em: {new Date(peca.salvoEm).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
      <Divider sx={{ my: 3, width: "100%" }} />
    </Box>
  );

}

export default ListaPeca;