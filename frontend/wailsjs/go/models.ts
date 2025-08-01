export namespace config {
	
	export class CPUInfo {
	    physical_cores: number;
	    logical_cores: number;
	    has_hyperthreading: boolean;
	
	    static createFrom(source: any = {}) {
	        return new CPUInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.physical_cores = source["physical_cores"];
	        this.logical_cores = source["logical_cores"];
	        this.has_hyperthreading = source["has_hyperthreading"];
	    }
	}

}

export namespace main {
	
	export class CrackResult {
	    success: boolean;
	    password: string;
	    timeSpent: string;
	    attempts: number;
	    speed: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new CrackResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.password = source["password"];
	        this.timeSpent = source["timeSpent"];
	        this.attempts = source["attempts"];
	        this.speed = source["speed"];
	        this.error = source["error"];
	    }
	}

}

