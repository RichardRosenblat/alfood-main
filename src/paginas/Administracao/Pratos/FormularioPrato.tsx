import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import IRestaurante from "../../../interfaces/IRestaurante";
import ITag from "../../../interfaces/ITag";

const FormularioPrato = () => {
	const params = useParams();

	const [nome, setNome] = useState("");
	const [descricao, setDescricao] = useState("");

	const [tag, setTag] = useState("");
	const [restaurante, setRestaurante] = useState("");

	const [imagem, setImagem] = useState<File | null>(null);

	const [tags, setTags] = useState<ITag[]>([]);
	const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

	useEffect(() => {
		http.get<{ tags: ITag[] }>(`tags/`)
			.then((res) => setTags(res.data.tags))
			.catch((err) => console.error(err));
		http.get<IRestaurante[]>(`restaurantes/`)
			.then((res) => setRestaurantes(res.data))
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (params.id) {
			http.get<IPrato>(`pratos/${params.id}/`)
				.then((res) => {
					setNome(res.data.nome);
					setDescricao(res.data.descricao);
					setTag(res.data.tag);
					setRestaurante(String(res.data.restaurante));
				})
				.catch((err) => console.error(err));
		}
	}, [params]);

	const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
		if (evento.target.files?.length) {
			setImagem(evento.target.files[0]);
			return;
		}

		setImagem(null);
	};

	const aoSubmeterForm = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData();

		formData.append("nome", nome);
		formData.append("descricao", descricao);

		formData.append("tag", tag);
		formData.append("restaurante", restaurante);

		if (imagem) {
			formData.append("imagem", imagem);
		}

		if (params.id) {
			http.request({
				url: `pratos/${params.id}/`,
				method: "PUT",
				headers: {
					"Content-Type": "multipart/form-data",
				},
				data: formData,
			})
				.then(() => {
					alert("Prato atualizado");
				})
				.catch((err) => console.error(err));
			return;
		}

		http.request({
			url: "pratos/",
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			data: formData,
		})
			.then(() => {
				alert("Prato cadastrado");
				setNome("");
				setDescricao("");
				setTag("");
				setRestaurante("");
				setImagem(null);
			})
			.catch((err) => console.error(err));
	};

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
				<Typography component="h1" variant="h6">
					Formulário de Pratos
				</Typography>
				<Box component="form" sx={{ width: "100%" }} onSubmit={aoSubmeterForm}>
					<TextField
						value={nome}
						onChange={(evento) => setNome(evento.target.value)}
						label="Nome do Prato"
						variant="standard"
						fullWidth
						required
						margin="dense"
					/>
					<TextField
						value={descricao}
						onChange={(evento) => setDescricao(evento.target.value)}
						label="Descrição do Prato"
						variant="standard"
						fullWidth
						required
						margin="dense"
					/>
					<FormControl margin="dense" fullWidth>
						<InputLabel id="select-tag">Tag</InputLabel>
						<Select labelId="select-tag" value={tag} onChange={(evento) => setTag(evento.target.value)}>
							{tags.map((tag) => (
								<MenuItem key={tag.id} value={tag.value}>
									{tag.value}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl margin="dense" fullWidth>
						<InputLabel id="select-restaurante">Restaurante</InputLabel>
						<Select
							labelId="select-restaurante"
							value={restaurante}
							onChange={(evento) => setRestaurante(evento.target.value)}
						>
							{restaurantes.map((restaurante) => (
								<MenuItem key={restaurante.id} value={restaurante.id}>
									{restaurante.nome}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<input type="file" onChange={selecionarArquivo} />
					<Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">
						Salvar
					</Button>
				</Box>
			</Box>
		</>
	);
};

export default FormularioPrato;
