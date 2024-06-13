// @ts-nocheck
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useCanvasContext } from '../../../context/CanvasContext';
import {
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Typography,
} from '@mui/material';
import Select, { MultiValue, SingleValue } from 'react-select';
import Creatable from 'react-select/creatable';
import { getSummary } from '../../../api/write-post';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
	setSummaryContent: Dispatch<SetStateAction<string | undefined>>;
}
const SummaryForm: FC<Props> = ({ setSummaryContent }: Props) => {
	const { scrapURL } = useCanvasContext();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		url: scrapURL,
		vibe: 'positive',
		format: 'text',
		emojis: false,
		hashtags: [],
		social_media: 'twitter',
		char_count: 280,
	});

	const socialMedias = [
		{
			label: 'Twitter',
			value: 'twitter',
			length: 280,
		},
		{
			label: 'Facebook',
			value: 'facebook',
			length: 600,
		},
	];

	const handleHashtagSelectChange = (
		newValue: MultiValue<{
			label: string;
			value: string;
		}>
	) => {
		if (!newValue) return;

		const updatedHashtags = newValue.map((option) => option.value);

		setFormData((prev) => ({
			...prev,
			hashtags: updatedHashtags,
		}));
	};

	const handleSocialSelectChange = (
		newValue: SingleValue<{
			label: string;
			value: string;
		}>
	) => {
		setFormData((prev) => ({ ...prev, social_media: newValue!.value }));
	};

	const generateSummaryHandler = async () => {
		try {
			setIsLoading(true);
			const data = await getSummary(formData);
			console.log(data.data.data.response.content);
			setSummaryContent(data?.data?.data?.response);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<FormGroup>
				<FormControlLabel
					control={<Checkbox defaultChecked />}
					checked={formData.emojis}
					onChange={(e) =>
						setFormData((prev) => ({
							...prev,
							emojis: e.target.checked,
						}))
					}
					label='Emojis'
				/>
				<br />
				<Typography>Hashtags</Typography>
				<Creatable
					onChange={handleHashtagSelectChange}
					name='hashtags'
					placeholder='Hashtags'
					options={formData.hashtags?.map((h) => ({ value: h, label: h }))}
					className='basic-multi-select'
					classNamePrefix='select'
					isClearable
					isMulti
				/>
				<br />
				<Typography>Social Platforms</Typography>
				<Select
					defaultValue={{ label: 'Social Media', value: '' }}
					onChange={handleSocialSelectChange}
					name='colors'
					placeholder='Social Media'
					options={socialMedias}
					className='basic-single'
					classNamePrefix='select'
				/>

				<Button
					onClick={generateSummaryHandler}
					variant='contained'
					sx={{
						textTransform: 'capitalize',
					}}
					sx={{ mt: 2 }}
					endIcon={isLoading ? <CircularProgress size={20} /> : null}
				>
					Generate
				</Button>
			</FormGroup>
		</div>
	);
};

export default SummaryForm;
