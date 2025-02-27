import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Test from "../../assets/images/slider/Image-01.jpg";
import axios from "axios";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { Flip } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function MediaCardUser() {
	let navigate = useNavigate();

	const UpdateProduct = (id) => {
		navigate(`/updateProduct/${id}`);
	};

	const [product, setProduct] = React.useState([]);

	const login = localStorage.getItem("login");

	useEffect(() => {
		const getPrducts = async () => {
			await axios
				.get(`http://localhost:5000/api/product/getAll`)
				.then((res) => {
					console.log("res", res);
					setProduct(res.data.data);
				})
				.catch((err) => {
					console.log(
						"🚀 ~ file: index.jsx:252 ~ getAllCategory ~ err",
						err.massage,
					);
				});
		};

		getPrducts();
	});

	const handleBuy = () => {
		if (!login) {
			toast.warning(
				"Server Error: You should login to the system first !",
			);
		}
	};

	return (
		<>
			<Grid
				container
				spacing={3}
				sx={{ mx: "30px", marginBottom: "30px" }}
				style={{ width: "90%" }}>
				{product.map((product) => (
					<Grid
						item
						xs={3}
						direction="row"
						key={product._id}
						style={{ width: "100%" }}>
						<Card sx={{ maxWidth: 345 }}>
							<CardMedia
								sx={{ height: 160 }}
								image={product.productImage}
								title="green iguana"
							/>
							<CardContent>
								<Typography
									gutterBottom
									variant="h5"
									component="div">
									{product.name}
								</Typography>
								<Typography
									gutterBottom
									variant="h6"
									component="div">
									Rs.{product.price}.00
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary">
									{product.color}
								</Typography>
							</CardContent>
							<CardActions>
								<Button
									size="small"
									variant="contained"
									sx={{
										marginLeft: "70%",
										background: "#5ebc67",
									}}
									onClick={handleBuy}>
									Buy Now
								</Button>
							</CardActions>
						</Card>
					</Grid>
				))}
			</Grid>
			<ToastContainer
				position="top-right"
				autoClose={1000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				transition={Flip}
				pauseOnHover={false}
				theme="colored"
			/>
		</>
	);
}
