import * as React from "react";
import { registerWidget,} from './uxp';
import './styles.scss';
import EquipmentRegisterWidget from "./EquipmentRegisterWidget";

/**
 * Register as a Widget
 */
registerWidget({
    id: "EquipmentRegister",
    name: "EquipmentRegister",
    widget: EquipmentRegisterWidget,
    configs: {
        layout: {
            w: 9,
            h: 11,
            minH: 11,
            minW: 9
        }
    }
});

/**
 * Register as a Sidebar Link
 */
/*
registerLink({
    id: "EquipmentRegister",
    label: "EquipmentRegister",
    // click: () => alert("Hello"),
    component: EquipmentRegisterWidget
});
*/

/**
 * Register as a UI
 */

/*
registerUI({
   id:"EquipmentRegister",
   component: EquipmentRegisterWidget
});
*/