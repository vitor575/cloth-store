import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  Divider,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";

const formasPagamento = ["Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"];

// helper currency formatter
const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

const Vendas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pecasSelecionadas = location.state?.pecasSelecionadas || [];

  // cliente
  const [clienteNome, setClienteNome] = useState("");
  const [clienteCpf, setClienteCpf] = useState("");
  const [clienteTelefone, setClienteTelefone] = useState("");

  // per-item state arrays
  const [priceBases, setPriceBases] = useState([]); // R$/kg
  const [soldWeights, setSoldWeights] = useState([]); // kg vendidos nesta venda
  const [discountPercents, setDiscountPercents] = useState([]); // % por item

  // init from selected pieces
  useEffect(() => {
    const pb = pecasSelecionadas.map((p) => {
      // default price base by artigo (fallback value)
      const artigo = (p.artigo || "").toLowerCase();
      if (artigo.includes("algod")) return 50;
      if (artigo.includes("lino")) return 80;
      if (artigo.includes("poli")) return 40;
      return 60;
    });

    const sw = pecasSelecionadas.map((p) => {
      // sold by default full stock (you can change)
      const parsed = Number(p.peso) || 0;
      // default: if parsed > 100 default to 50 as a more realistic prefill? keep full to be safe
      return parsed;
    });

    const dp = pecasSelecionadas.map(() => 0);

    setPriceBases(pb);
    setSoldWeights(sw);
    setDiscountPercents(dp);
  }, [pecasSelecionadas]);

  // calculations
  const itemsWithTotals = useMemo(() => {
    return pecasSelecionadas.map((p, i) => {
      const pesoDisponivel = Number(p.peso) || 0;
      const sold = Number(soldWeights[i]) || 0;
      const base = Number(priceBases[i]) || 0;
      const descontoPct = Number(discountPercents[i]) || 0;

      const subtotal = sold * base;
      const descontoValor = (subtotal * descontoPct) / 100;
      const total = Math.max(subtotal - descontoValor, 0);

      return {
        original: p,
        pesoDisponivel,
        sold,
        base,
        descontoPct,
        subtotal,
        descontoValor,
        total,
      };
    });
  }, [pecasSelecionadas, soldWeights, priceBases, discountPercents]);

  const subtotalAll = useMemo(() => itemsWithTotals.reduce((s, it) => s + it.subtotal, 0), [itemsWithTotals]);
  const totalDescontos = useMemo(() => itemsWithTotals.reduce((s, it) => s + it.descontoValor, 0), [itemsWithTotals]);
  const totalFinal = useMemo(() => itemsWithTotals.reduce((s, it) => s + it.total, 0), [itemsWithTotals]);

  // handlers
  const handleChangePriceBase = (index, value) => {
    const next = [...priceBases];
    next[index] = Number(value) || 0;
    setPriceBases(next);
  };

  const handleChangeSoldWeight = (index, value) => {
    const next = [...soldWeights];
    next[index] = Number(value) || 0;
    setSoldWeights(next);
  };

  const handleChangeDiscount = (index, value) => {
    const next = [...discountPercents];
    next[index] = Number(value) || 0;
    setDiscountPercents(next);
  };

  const handleConfirmVenda = () => {
    // basic validation
    if (!clienteCpf && !clienteTelefone && !clienteNome) {
      if (!window.confirm("Cliente sem dados. Deseja continuar a venda sem cliente?")) return;
    }

    // check sold weight > available
    const over = itemsWithTotals.filter((it) => it.sold > it.pesoDisponivel);
    if (over.length > 0) {
      if (!window.confirm("Alguns itens possuem quantidade vendida maior que a disponível. Continuar?")) return;
    }

    const venda = {
      id: Date.now(),
      clienteNome,
      clienteCpf,
      clienteTelefone,
      itens: itemsWithTotals.map((it) => ({
        etiqueta: it.original.etiqueta,
        artigo: it.original.artigo,
        tonalidade: it.original.tonalidade,
        pesoVendido: it.sold,
        precoBase: it.base,
        descontoPercent: it.descontoPct,
        subtotal: it.subtotal,
        descontoValor: it.descontoValor,
        total: it.total,
      })),
      subtotal: subtotalAll,
      descontoTotal: totalDescontos,
      totalFinal,
      formaPagamento: formaPagamentoState,
      criadoEm: new Date().toISOString(),
    };

    // save em localStorage (append)
    const KEY = "vendas_lista_v1";
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(venda);
    localStorage.setItem(KEY, JSON.stringify(arr));

    alert("Venda registrada com sucesso!");
    console.log("venda gravada:", venda);

    // opcional: redireciona para a lista ou limpar
    navigate("/", { replace: true });
  };

  const [formaPagamentoState, setFormaPagamentoState] = useState("");

  if (!pecasSelecionadas || pecasSelecionadas.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Nenhuma peça selecionada para venda.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Nova Venda
      </Typography>

      <Grid container spacing={2}>
        {/* left: itens */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Dados do Cliente
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome"
                  value={clienteNome}
                  onChange={(e) => setClienteNome(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="CPF"
                  value={clienteCpf}
                  onChange={(e) => setClienteCpf(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Telefone"
                  value={clienteTelefone}
                  onChange={(e) => setClienteTelefone(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>

          {pecasSelecionadas.map((peca, idx) => {
            const it = itemsWithTotals[idx];
            return (
              <Accordion key={idx} defaultExpanded={idx === 0} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontWeight: 600 }}>{peca.etiqueta}</Typography>
                    <Typography color="text.secondary">
                      {peca.artigo} • {peca.tonalidade}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2">Disponível: {it.pesoDisponivel} kg</Typography>
                      <TextField
                        label="Peso vendido (kg)"
                        type="number"
                        inputProps={{ step: 0.01, min: 0 }}
                        value={it.sold}
                        onChange={(e) => handleChangeSoldWeight(idx, e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Preço base (R$/kg)"
                        type="number"
                        inputProps={{ step: 0.01, min: 0 }}
                        value={it.base}
                        onChange={(e) => handleChangePriceBase(idx, e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Desconto (%)"
                        type="number"
                        inputProps={{ step: 0.1, min: 0, max: 100 }}
                        value={it.descontoPct}
                        onChange={(e) => handleChangeDiscount(idx, e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography>Subtotal: {fmt(it.subtotal)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>Desconto: -{fmt(it.descontoValor)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Total do item: {fmt(it.total)}</Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Grid>

        {/* right: resumo */}
        <Grid item xs={12} md={4} sx={{width: '30%'}}>
          <Card sx={{ position: { md: "sticky" }, top: 16, borderRadius: 2, boxShadow: 3}}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo
              </Typography>

              <Stack spacing={1} sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Itens</Typography>
                  <Typography>{pecasSelecionadas.length}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>{fmt(subtotalAll)}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Descontos</Typography>
                  <Typography>- {fmt(totalDescontos)}</Typography>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="h6">{fmt(totalFinal)}</Typography>
                </Box>

                <TextField
                  select
                  label="Forma de pagamento"
                  value={formaPagamentoState}
                  onChange={(e) => setFormaPagamentoState(e.target.value)}
                  fullWidth
                >
                  {formasPagamento.map((fp) => (
                    <MenuItem key={fp} value={fp}>
                      {fp}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1 }}
                  disabled={totalFinal <= 0}
                  onClick={handleConfirmVenda}
                >
                  Confirmar Venda
                </Button>

                <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}


export default Vendas;
