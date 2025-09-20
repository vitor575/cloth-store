import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useNavigate } from "react-router-dom";
import { LISTA_INICIAL } from "../../list";
const STORAGE_KEY = "pecas_lista_v1";

const tonalidades = [
  "Azul",
  "Verde",
  "Branco",
  "Preto",
  "Rosa",
  "Vermelho",
  "Amarelo",
];

const artigos = ["Poliester", "Lino", "Algodao"];

const ListaPeca = () => {
  const [data, setData] = useState(LISTA_INICIAL);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setData(JSON.parse(stored));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const columns = [
    {
      accessorKey: "etiqueta",
      header: "Etiqueta",
    },
    {
      accessorKey: "artigo",
      header: "Artigo",
      filterVariant: "multi-select",
      filterSelectOptions: artigos,
    },
    {
      accessorKey: "tonalidade",
      header: "Tonalidade",
      filterVariant: "multi-select",
      filterSelectOptions: tonalidades,
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Peças
      </Typography>

      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ isLoading: loading }}
        enableRowSelection
        enableColumnFilters
        enableGlobalFilter
        enablePagination
        enableSorting
        renderTopToolbarCustomActions={({ table }) => {
          const selected = table.getSelectedRowModel().rows.map(
            (r) => r.original
          );

          return (
            <Button
              variant="contained"
              disabled={selected.length === 0}
              onClick={() =>
                navigate("/vendas", { state: { pecasSelecionadas: selected } })
              }
            >
              Ir para Vendas ({selected.length})
            </Button>
          );
        }}
      />
    </Box>
  );
};

export default ListaPeca;
