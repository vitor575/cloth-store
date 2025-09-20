import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

const Vendas = () => {
  const location = useLocation();
  const pecas = location.state?.pecasSelecionadas || [];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Tela de Vendas
      </Typography>

      {pecas.length === 0 ? (
        <Typography>Nenhuma peça selecionada.</Typography>
      ) : (
        pecas.map((p, idx) => (
          <Paper key={idx} sx={{ p: 1, mb: 1 }}>
            <Typography>
              <strong>Etiqueta:</strong> {p.etiqueta}
            </Typography>
            <Typography>
              <strong>Artigo:</strong> {p.artigo}
            </Typography>
            <Typography>
              <strong>Tonalidade:</strong> {p.tonalidade}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default Vendas;
