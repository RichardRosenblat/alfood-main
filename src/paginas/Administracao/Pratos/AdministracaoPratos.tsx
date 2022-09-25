import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";

const AdministracaoPratos = () => {
	const [pratos, setPratos] = useState<IPrato[]>([]);

	useEffect(() => {
		http.get<IPrato[]>("pratos/").then((res) => {
			setPratos(res.data);
		});
	}, []);

	const excluir = (pratoDeletado: IPrato) => {
		http.delete<IPrato[]>(`pratos/${pratoDeletado.id}/`).then(() => {
			const listaDePratos = pratos.filter((prato) => prato.id !== pratoDeletado.id);
			setPratos(listaDePratos);
		});
	};

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Imagem</TableCell>
						<TableCell>Nome</TableCell>
						<TableCell>Descrição</TableCell>
						<TableCell>Tag</TableCell>
						<TableCell>Editar</TableCell>
						<TableCell>Excluir</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{pratos.map((prato) => (
						<TableRow key={prato.id}>
							<TableCell>
								<img src={prato.imagem} alt={prato.descricao} height="80px" />
							</TableCell>
							<TableCell>{ prato.nome}</TableCell>
							<TableCell>
								{prato.descricao}
							</TableCell>
							<TableCell>{prato.tag}</TableCell>
							<TableCell>
								[<Link to={`/admin/pratos/${prato.id}`}>Editar</Link>]
							</TableCell>
							<TableCell>
								<Button variant="outlined" color="error" onClick={() => excluir(prato)}>
									Excluir
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default AdministracaoPratos;
