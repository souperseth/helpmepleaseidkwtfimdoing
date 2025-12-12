import { useState } from "react";
import IGCParser from "igc-parser";
import * as igcUtils from "../utils/igcUtils";
import api from "~/api";

// IGC Files can be found in public folder
export default function IGCUploader() {
	const [file, setFile] = useState<string | ArrayBuffer | null | undefined>(
		""
	);
	const [fileName, setFileName] = useState("");

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newFile = event.target.files?.[0];
		if (newFile) {
			setFileName(newFile.name);
			const reader = new FileReader();
			reader.onload = (e) => {
				const content = e.target?.result;
				setFile(content);
			};
			reader.readAsText(newFile);
		}
	};

	// Handle file submission
	async function onSubmit(e: any) {
		if (!file) {
			return;
		}
		const flight = IGCParser.parse(file.toString());
		const parsedFileData = igcUtils.parse(flight);
		console.log(parsedFileData);

		try {
			const response = await api.post(`/igc/`, parsedFileData);
			console.log(response);
		} catch (error) {
			console.error(`Error adding igc`);
		} finally {
		}
	}

	function onClear() {
		setFile("");
	}

	// file upload container
	return (
		<div className="container">
			{/* <div className="flex flex-col justify-center w-50"> */}
			<button>
				<label htmlFor="fileInput">
					{file ? fileName : "Choose IGC File"}
					<input
						id="fileInput"
						type="file"
						className="hidden"
						accept="application/x-igc"
						onChange={handleFileChange}
					/>
				</label>
			</button>
			<button onClick={onSubmit}>Upload File</button>
			<button onClick={onClear}>Clear</button>
			{/* </div> */}
		</div>
	);
}
