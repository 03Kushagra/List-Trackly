import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Lists: undefined;
    Account: undefined;
    ListDetail: { listId: string; title?: string };
    BulkAdd: { listId: string };
    Login: undefined;
    OTP: { phone: string };
};
