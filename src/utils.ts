import ps from 'ps-node';

export async function delay(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}


// A simple pid lookup (LOOKUP SI USA CON KILLAPP)
export async function checkProcess(pid, returnFlag: any = '') {
    let returKillAppFlag = '';

    return new Promise(function(resolve) {
        ps.lookup({ pid: pid }, function (err, resultList) {
            let process = undefined;
            //se resultList E' VUOTO E LO INDICIZZI CHE SUCCEDE? 
            if(resultList !== undefined && resultList.length > 0){
                process = resultList[0];
            }

            if (err) {
                console.log(err);
            }

            if (process) {
                killApp(pid, returKillAppFlag).then(function(val) {
                    // returKillAppFlag = val;
                    returnFlag = val;
                }); 
            } else {
                console.log('No such process found!');
            }

            resolve(returnFlag);
        });
    });
}

export async function killApp(pid, returnFlag) {
    return new Promise(function(resolve) {
        ps.kill(pid, { signal: 'SIGKILL', timeout: 2000}, function (err) {
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
}