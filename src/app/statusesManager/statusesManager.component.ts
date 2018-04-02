import { Component, OnInit, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { TreeNode, MenuItem } from 'primeng/api';
import { TerritoryService } from '../_services/index';
import { createLeafNode, createStationNode } from '../_services/territory.service';
import { Region, District, Station } from '../_models/territory';
import { ButtonModule} from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SharedModule } from 'primeng/components/common/shared';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DataListModule } from 'primeng/datalist';

import { StatusComponent } from './status/status.component';
import { TerritoryComponent } from './territory/territory.component';

import { TreeDragDropService } from 'primeng/api';
//import { TreeDragDropService } from '../_services/customDragNDrop.service';
import { UITreeNode } from 'primeng/components/tree/tree';
import { StatusService } from '../_services/status.service';

@Component({
  selector: 'app-statuses',
  templateUrl: './statusesManager.component.html',
  styleUrls: ['./statusesManager.component.css']
})
export class StatusManagerComponent {
  _display: boolean;
  
  @Output() displayChange = new EventEmitter();


  @Input() get display() {
    return this._display;
  }

  set display(value: boolean) {
    this._display = value;
    this.displayChange.emit(value);
  }
}

UITreeNode.prototype.onDropPoint = function (event) { /* todo: implement when status point not on node */ };

UITreeNode.prototype.onDropNode = function (event) {

    if (this.tree.dragNode) {
      if (this.tree.droppableNodes && this.node.droppable !== false) {
        event.preventDefault();
        event.stopPropagation();
        var dragNode = this.tree.dragNode;
        if (!this.node.children) this.node.children = []; 
        if (this.tree.allowDrop(dragNode, this.node, this.tree.dragNodeScope)) {
          var dragNodeIndex = this.tree.dragNodeIndex;
          const dropNode = this.node;
          //goDown(this.node, dragNode, this.tree);
          
          
          if (dropNode.data.type === 'station' || dropNode.data.type === 'static') {
            dropNode.expanded = true;
            this.tree.onNodeExpand.emit({node: dropNode});
            if (!dropNode.children) dropNode.children = [];
            if (dropNode.children.includes(dragNode)) return
            dropNode.children.push(dragNode);
          } 
          
          this.tree.dragDropService.stopDrag({
            node: dragNode,
            subNodes: this.node.parent ? this.node.parent.children : this.tree.value,
            index: this.tree.dragNodeIndex
          });
          this.tree.onNodeDrop.emit({
            originalEvent: event,
            dragNode: dragNode,
            dropNode: this.node,
            index: this.index
          });
          }
          
      }
    }
    else {
      this.tree.onNodeDrop.emit({
        originalEvent: event,
        dropNode: this.node,
        index: this.index
      });	
    }
    this.draghoverNode = false; 
};

@NgModule({
  imports: [
    DialogModule,
    ButtonModule,
    TreeModule,
    SharedModule,
    ContextMenuModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    DropdownModule,
    DataListModule,
  ],
  providers: [
    TerritoryService,
    StatusService,  
    TreeDragDropService,
  ],
  declarations:[
    StatusManagerComponent,
    StatusComponent,
    TerritoryComponent,
  ],
  exports: [
    StatusManagerComponent
  ]
})
export class StatusesModule {

}