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

import { ConstituencyComponent } from './constituency/constituency.component';
import { TerittoryComponent } from './territory/territory.component';

import { TreeDragDropService } from 'primeng/api';
//import { TreeDragDropService } from '../_services/customDragNDrop.service';
import { UITreeNode } from 'primeng/components/tree/tree';

@Component({
  selector: 'app-territories',
  templateUrl: './territoriesManager.component.html',
  styleUrls: ['./territoriesManager.component.css']
  //styles: [`/deep/ div { width: 100%; }`],
})
export class TerritoryManagerComponent {
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


UITreeNode.prototype.onDropPoint = function (event) {
  
}

UITreeNode.prototype.onDropNode = function (event) {
    if (this.tree.dragNode) {
      if (this.tree.droppableNodes && this.node.droppable !== false) {
        event.preventDefault();
        event.stopPropagation();
        var dragNode = this.tree.dragNode;
        if (!this.node.children) { this.node.children = []; }
        if (this.tree.allowDrop(dragNode, this.node, this.tree.dragNodeScope) && 
            !this.node.children.includes(dragNode)) {
          var dragNodeIndex = this.tree.dragNodeIndex;
          this.node.expanded = true;
          //this.tree.dragNodeSubNodes.splice(dragNodeIndex, 1);
          if (this.node.children)
            this.node.children.push(dragNode);
          else
            this.node.children = [dragNode];

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
  ],
  providers: [
    TerritoryService,
    TreeDragDropService,
  ],
  declarations:[
    TerittoryComponent,
    ConstituencyComponent,
    TerritoryManagerComponent,
    //UITreeNode,
  ],
  exports: [
    TerritoryManagerComponent
  ]
})
export class TerritoryModule {

}