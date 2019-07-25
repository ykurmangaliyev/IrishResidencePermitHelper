const IRPDataKey = "IRPData";

function getIRPDataAsync()
{
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(IRPDataKey, (data) => {
            console.debug("Get IRP data: ", data[IRPDataKey]);
            resolve(data[IRPDataKey]);
        });
    });
}

function setIRPDataAsync(data)
{
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [IRPDataKey]: data }, () => {
            console.debug("Set IRP data: ", data);
            resolve();
        });
    })    
}