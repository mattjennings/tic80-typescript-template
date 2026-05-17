// script: js
//#region src/helpers.ts
function printh(msg, color) {
	if (typeof msg === "string") trace(msg, color);
	else trace(JSON.stringify(msg, null, 1), color);
}
//#endregion
//#region src/main.ts
let t = 0;
let x = 96;
let y = 24;
globalThis.BOOT = function BOOT() {
	printh("Module import works!");
};
globalThis.TIC = function TIC() {
	if (btn(0)) y--;
	if (btn(1)) y++;
	if (btn(2)) x--;
	if (btn(3)) x++;
	cls(13);
	spr(1 + (t % 60 / 30 | 0) * 2, x, y, 14, 3, 0, 0, 2, 2);
	print("HEELLO WORLD!", 84, 84);
	t++;
};
//#endregion
