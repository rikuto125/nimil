import { atom } from "recoil";

import { ModalState, modalStateOption } from "@nimil-jp/react-utils";

const modalState = atom<ModalState>(modalStateOption);
export default modalState;
