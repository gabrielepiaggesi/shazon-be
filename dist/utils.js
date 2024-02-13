"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.killApp = exports.checkProcess = exports.delay = void 0;
const ps_node_1 = __importDefault(require("ps-node"));
function delay(time) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    });
}
exports.delay = delay;
// A simple pid lookup (LOOKUP SI USA CON KILLAPP)
function checkProcess(pid, returnFlag = '') {
    return __awaiter(this, void 0, void 0, function* () {
        let returKillAppFlag = '';
        return new Promise(function (resolve) {
            ps_node_1.default.lookup({ pid: pid }, function (err, resultList) {
                let process = undefined;
                //se resultList E' VUOTO E LO INDICIZZI CHE SUCCEDE? 
                if (resultList !== undefined && resultList.length > 0) {
                    process = resultList[0];
                }
                if (err) {
                    console.log(err);
                }
                if (process) {
                    killApp(pid, returKillAppFlag).then(function (val) {
                        // returKillAppFlag = val;
                        returnFlag = val;
                    });
                }
                else {
                    console.log('No such process found!');
                }
                resolve(returnFlag);
            });
        });
    });
}
exports.checkProcess = checkProcess;
function killApp(pid, returnFlag) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve) {
            ps_node_1.default.kill(pid, { signal: 'SIGKILL', timeout: 2000 }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Process %s has been killed!', pid);
                    returnFlag = 'finito';
                }
                resolve(returnFlag);
            });
        });
    });
}
exports.killApp = killApp;
//# sourceMappingURL=utils.js.map