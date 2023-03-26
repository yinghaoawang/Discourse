import { useContext, useEffect } from 'react';
import { SettingsContext } from '../../../../contexts/settings.context';
import { getDevices } from '../../../../util/helpers.util';
import { DeviceTypes } from '../../../../util/constants.util';
import './device-settings.styles.scss';

const removeSelectOptions = (selectNode) => {
    while (selectNode.firstChild) {
        selectNode.removeChild(selectNode.lastChild);
    }
}

const DeviceSettings = () => {
    const { currentInputDevice, setCurrentInputDevice, currentOutputDevice, setCurrentOutputDevice } = useContext(SettingsContext);

    useEffect(() => {
        const resetDevices = async () => {
            const inputDeviceSelect = document.getElementById('inputDeviceSelect');
            const outputDeviceSelect = document.getElementById('outputDeviceSelect');
    
            const { inputDevices, outputDevices } = await getDevices();
    
            const inputOptions = inputDevices.map(audioDevice => {
                return {
                    value: audioDevice.deviceId,
                    text: audioDevice.label
                };
            });
    
            const outputOptions = outputDevices.map(audioDevice => {
                return {
                    value: audioDevice.deviceId,
                    text: audioDevice.label
                };
            })

            const createOptionsForSelect = (selectNode, options, { removePreviousOptions = true, selectedValue } = {}) => {
                if (removePreviousOptions) {
                    removeSelectOptions(selectNode);
                }
        
                for (const option of options) {
                    const optionNode = document.createElement('option');
                    optionNode.value = option.value;
                    optionNode.text = option.text;
                    selectNode.appendChild(optionNode);
                }
                
                selectNode.value = selectedValue;
            }
    
            createOptionsForSelect(inputDeviceSelect, inputOptions, { selectedValue: currentInputDevice?.deviceId });
            createOptionsForSelect(outputDeviceSelect, outputOptions, { selectedValue: currentOutputDevice?.deviceId });
        }
        resetDevices();
        
    }, []);

    

    const changeInputDevice = async (value, type = DeviceTypes.INPUT) => {
        switch (type) {
            case DeviceTypes.INPUT:
            const { inputDevices } = await getDevices();
                const matchingInputDevice = inputDevices.find(d => d.deviceId === value);
                setCurrentInputDevice(matchingInputDevice);
                break;
            case DeviceTypes.OUTPUT:
                const { outputDevices } = await getDevices();
                const matchingOutputDevice = outputDevices.find(d => d.deviceId === value);
                setCurrentOutputDevice(matchingOutputDevice);
                break;
            default:
                throw new Error('Unhandled deviceType in changeInputDeviceHandler');
        }
    }

    return (
        <div className='device-settings-container'>
            <div className='header'>Device Settings</div>
            <div className='content'>
                <div className='input-device form-item'>
                    <label>Input Device</label>
                    <select onChange={ (e) => { changeInputDevice(e?.target?.value, DeviceTypes.INPUT) } } value={ currentInputDevice?.deviceId } id='inputDeviceSelect' />
                </div>
                <div className='output-device form-item'>
                    <label>Output Device</label>
                    <select onChange={ (e) => { changeInputDevice(e?.target?.value, DeviceTypes.OUTPUT) } } value={ currentOutputDevice?.deviceId } id='outputDeviceSelect' />
                </div>
            </div>
        </div>
    );
}

export default DeviceSettings;