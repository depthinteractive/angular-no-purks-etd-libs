export interface TableColumn {
	children?: TableColumn[];
	key: string;
	title: string;
	prop?: Object;
	visible: boolean;
	relative?: string[];
}
