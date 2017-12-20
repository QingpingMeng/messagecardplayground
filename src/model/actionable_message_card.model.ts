export type ActionableMessageCard = {
    id: string;
    name: string;
    type: string;
    body: string;
    headers: [{ name: string, value: string }]
};
