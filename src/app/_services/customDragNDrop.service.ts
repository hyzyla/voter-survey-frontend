import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from 'primeng/api';
import { TreeNodeDragEvent } from 'primeng/api';

export interface TreeNodeDragEvent {
    tree?: any;
    node?: TreeNode;
    subNodes?: TreeNode[];
    index?: number;
    scope?: any;
}

@Injectable()
export class TreeDragDropService {
    
    private dragStartSource = new Subject<TreeNodeDragEvent>();
    private dragStopSource = new Subject<TreeNodeDragEvent>();
    
    dragStart$ = this.dragStartSource.asObservable();
    dragStop$ = this.dragStopSource.asObservable();
    constructor(){};
    startDrag(event: TreeNodeDragEvent) {
        this.dragStartSource.next(event);
    }
    
    stopDrag(event: TreeNodeDragEvent) {
        this.dragStopSource.next(event);
    }
}