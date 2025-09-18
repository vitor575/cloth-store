import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const STORAGE_KEY = "pecas_lista_v1";

const Cadastro = () => {
  const [etiqueta, setEtiqueta] = useState("");
  const [artigo, setArtigo] = useState("");
  const [tonalidade, setTonalidade] = useState("");
  const [peso, setPeso] = useState("");

  // opcional: manter a lista em memória também (útil para evitar ler do localStorage toda hora)
  const [lista, setLista] = useState([]);

  // carrega a lista ao montar o componente
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLista(parsed);
          console.log("Lista carregada do localStorage:", parsed);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar lista do localStorage:", err);
    }
  }, []);

  const salvarPeca = () => {
    // cria o objeto peça
    const nova = {
      id: Date.now(),
      etiqueta: etiqueta.trim(),
      artigo: artigo.trim(),
      tonalidade: tonalidade.trim(),
      peso: peso.trim(),
      salvoEm: new Date().toISOString(),
    };

    try {
      // 1) pega a lista atual (da memória ou do localStorage)
      const atual = Array.isArray(lista) && lista.length > 0 ? lista : (() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        try { return JSON.parse(raw) || []; } catch { return []; }
      })();

      // 2) adiciona a nova peça
      const novaLista = [ ...atual, nova ];

      // 3) salva de volta no localStorage (localStorage só guarda strings)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));

      // 4) atualiza estado local (opcional) e log
      setLista(novaLista);
      console.log("Peça adicionada e lista salva:", novaLista);

      // limpa campos
      setEtiqueta("");
      setArtigo("");
      setTonalidade("");
      setPeso("");
    } catch (err) {
      console.error("Erro ao salvar no localStorage:", err);
      alert("Falha ao salvar peça. Veja o console para detalhes.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Typography variant="h5" align="center" mt={2}>
        Cadastrar (salva lista no localStorage)
      </Typography>

      <Box
        m={3}
        p={3}
        gap={2}
        display="flex"
        flexDirection="column"
        border="1px solid rgba(0,0,0,0.15)"
        borderRadius={2}
        width="60%"
        maxWidth={700}
      >
        <TextField label="Etiqueta" value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} />
        <TextField label="Artigo" value={artigo} onChange={(e) => setArtigo(e.target.value)} />
        <TextField label="Tonalidade" value={tonalidade} onChange={(e) => setTonalidade(e.target.value)} />
        <TextField label="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} />

        <Button variant="contained" onClick={salvarPeca}>
          Salvar Peça
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary" mt={2}>
        Ao salvar, confira o console (F12) — a lista inteira será logada.
      </Typography>
    </Box>
  );
};

export default Cadastro;
