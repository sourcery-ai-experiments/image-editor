import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	SetStateAction,
} from 'react';

// Define interfaces
interface PaginationStateItem {
	page: number;
	template: string;
	templateJSON: TemplateJSON;
	backgroundImage: boolean;
	diptych: string | undefined;
	filePath: string;
	opacity: number; // Changed to number
	overlayImage: string;
	placeholderImage: string;
}

type TemplateJSON = any; // You can define the proper type for TemplateJSON

interface PaginationContext {
	paginationState: PaginationStateItem[];
	addPage: (newPage: PaginationStateItem) => void;
	update: (page: number, updatedFields: Partial<PaginationStateItem>) => void;
	selectedPage: number;
	setSelectedPage: React.Dispatch<SetStateAction<number>>;
	destroyMultiCanvas: () => void;
}

// Create context
const PaginationContext = createContext<PaginationContext | undefined>(
	undefined
);

// Custom hook to access the pagination context
const usePaginationContext = () => {
	const context = useContext(PaginationContext);
	if (!context) {
		throw new Error(
			'usePaginationContext must be used within a PaginationProvider'
		);
	}
	return context;
};

// Pagination provider component
const PaginationProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [paginationState, setPaginationState] = useState<PaginationStateItem[]>(
		[]
	);
	const [selectedPage, setSelectedPage] = useState<number>(1);

	const addPage = (newPage: PaginationStateItem) => {
		setPaginationState((prevState) => [...prevState, newPage]);
	};

	const update = async (
		page: number,
		updatedFields: Partial<PaginationStateItem>
	) => {
		setPaginationState((prevState) =>
			prevState.map((item) =>
				item.page === page ? { ...item, ...updatedFields } : item
			)
		);
	};
	const destroyMultiCanvas = () => {
		setSelectedPage(1);
		setPaginationState([]);
	};

	const paginationContextValue: PaginationContext = {
		paginationState,
		addPage,
		update,
		setSelectedPage,
		selectedPage,
		destroyMultiCanvas,
	};

	return (
		<PaginationContext.Provider value={paginationContextValue}>
			{children}
		</PaginationContext.Provider>
	);
};

export { PaginationProvider, usePaginationContext };
