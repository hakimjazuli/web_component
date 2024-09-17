export class Event_ {
    /**
     * @param {(event:Event)=>Promise<any>} scopedCallback
     */
    static listener: (scopedCallback: (event: Event) => Promise<any>) => (event: Event) => void;
}
