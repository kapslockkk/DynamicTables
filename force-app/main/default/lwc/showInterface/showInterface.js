import { LightningElement ,track} from 'lwc';
import getData from '@salesforce/apex/getAllDatas.takData';
import toDelRow from '@salesforce/apex/getAllDatas.toDelRow';
import delSelected from'@salesforce/apex/getAllDatas.delSelected';
import getSobjects from'@salesforce/apex/getAllDatas.getSobjects';
import toCheck from'@salesforce/apex/getAllDatas.toCheck';
import getEditableFields from '@salesforce/apex/getAllDatas.getEditableFields';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import TickerSymbol from '@salesforce/schema/Account.TickerSymbol';



const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];


const columns = [
    {label: 'Id', fieldName: 'Id'},
    {label: 'Account name', fieldName: 'Name'},
    
];

const data = [];


export default class ShowInterface extends NavigationMixin(LightningElement) {
    draftValues=[];
    defaultOptions=[];
    viewData=[];
    currentSObjects=[];
    columns = columns;
    selectedRecords=0;
    activeValueMessage = '';
    searchKey='Account';
    currentButton='New '+this.searchKey;
    results=null;
    datatoShow=null;
    dataLength=0;
    val=this.searchKey;
    showSelect=false;
    @track value = 10;
    @track totalPages;
    @track currentPage=1;
   

    @track label1=1;
    @track label2=2;
    @track label3=3;
    
    @track valToShow;

    editForm=false;


    connectedCallback(){
        this.handleLoad();
   }    

   tabs=[
    { 
        value: `Account`,
        label: `Accounts`,
    },
    {
        value: `Contact`,
        label: `Contacts`,
    
    },
    {
        value: `Opportunity`,
        label: `Opportunities`,
     
    },
    {
        value: `more`,
        label: `more`,
     
    }

    ]
    // get tabs() {
    //     const tabs = [];
       
    //         tabs.push({
    //             value: `Account`,
    //             label: `Accounts`,
               
    //         });
    //         tabs.push({
    //             value: `Contact`,
    //             label: `Contacts`,
                
    //         });
    //         tabs.push({
    //             value: `Lead`,
    //             label: `Leads`,
                
    //         });
    //         tabs.push({
    //             value: `Opportunity`,
    //             label: `Opportunities`,
             
    //         });
    //         tabs.push({
    //             value: `more`,
    //             label: `more`,
             
    //         });

       
    //     return tabs;
    // }

    handleActive(event) {

        if(event.target.value=="more")
        {
           
           
            getSobjects({})
            .then((result) => {
                this.currentSObjects=result;
                console.log(this.currentSObjects);
                this.error = undefined;
                this.openSelect();
                this.sObjects();
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });
           
           
           

           
            console.log('more');
        }
        else
        {
            console.log(event.target.value);
            this.searchKey=event.target.value;
            this.val=this.searchKey;
            this.currentButton='New '+this.searchKey;
            this.handleLoad();
        }
        
     
    }
    error;

    handleLoad() {
        this.btncolor(1);
        this.currentPage=1;
        this.loadLabels();
        
        getData({ str: this.searchKey })
        .then((result) => {
            console.log(result);

         
            console.log('kapil');

            console.log(result[0].Id);
            console.log(Object.keys(result[0]));
            console.log(Object.keys(result[0]).length);
            console.log(Object.keys(result[0])[0]);
           
            for(var i=0;i<Object.keys(result[0]).length;i++)
            {
              console.log(Object.keys(result[0])[i]);
              this.viewData.push(   { value: String(Object.keys(result[0])[i]), label: String(Object.keys(result[0])[i]) }  );
            }
            console.log(this.viewData);

            this.columns = [
                {label: Object.keys(result[0])[0], fieldName: Object.keys(result[0])[0]},
                {label: Object.keys(result[0])[6], fieldName: Object.keys(result[0])[6]},
                {label: Object.keys(result[0])[2], fieldName: Object.keys(result[0])[2]},
                {label: Object.keys(result[0])[3], fieldName: Object.keys(result[0])[3]},
                {label: Object.keys(result[0])[4], fieldName: Object.keys(result[0])[4]},
                {
                    type: 'action',
                    typeAttributes: { rowActions: actions },
                },
               
                
            ];
            this.defaultOptions=[Object.keys(result[0])[0],Object.keys(result[0])[6],Object.keys(result[0])[2],Object.keys(result[0])[3],Object.keys(result[0])[4]]





            this.results=result;
            this.dataLength=this.results.length;
            this.datatoShow=this.results.slice(0,this.value);
            console.log(this.datatoShow);


            this.totalPages=Math.ceil(this.dataLength/this.value);

                console.log('kaps');
                console.log(this.totalPages);
                console.log('kaps');
                this.valToShow="page "+this.currentPage+" of "+this.totalPages




            this.error = undefined;
        })
        .catch((error) => {
            this.error = error;
          
        });
    }



    listOptions = this.viewData;
    changedOk=[];


  //  requiredOptions = ['2', '7'];
    @track isModalOpen = false;
    handleChange1(event) {
        // Get the list of the "value" attribute on all the selected options
        const selectedOptionsList = event.detail.value;
        console.log(selectedOptionsList[0]);
        this.changedOk=selectedOptionsList;
        
      
        console.log(`Options selected: ${selectedOptionsList}`);
      
    }

    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    okModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;

        this.defaultOptions=this.changedOk;
        this.columns=[];
        for(var i=0;i<this.changedOk.length;i++)
        {
            this.columns.push(  {label: this.changedOk[i], fieldName: this.changedOk[i]},);
        }
        this.columns.push({
                            type: 'action',
                            typeAttributes: { rowActions: actions },
                        },);
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.editForm=false;
    }


    handleSelection(event){
        console.log('selected');

        this.draftValues=event.detail.selectedRows;
        console.log(this.draftValues);
        this.selectedRecords=this.draftValues.length;
        //console.log('this.draftValues ::: '+JSON.stringify(this.draftValues));
   }

   createNew() {
   
   
   console.log('calling tempMethod');
    this.tempMethod();
   
   
    console.log('new');
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: this.searchKey,
            actionName: 'new'
        }
    });
}


@track rowId;
@track editableFild=[];
handleRowAction( event ) {

        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch ( actionName ) {
            //in case of  view
            case 'view':
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view',
                    },
                }).then(url => {
                     window.open(url);
                });
                break;

                //in case of edit
            case 'edit':
                // this[NavigationMixin.Navigate]({
                //     type: 'standard__recordPage',
                //     attributes: {
                //         recordId: row.Id,
                //         objectApiName: this.searchKey,
                //         actionName: 'edit'
                //     }
                // });

                getEditableFields({ objectType: String(this.searchKey) })
            .then((result) => {
                
                this.rowId=row.Id;
                console.log(row.Id);

                this.editableFild=[];
                this.editableFild=result;
                console.log(this.editableFild[0]);

                this.error = undefined;

                this.editForm=true;
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });


               // window.location.reload();
                break;
            case 'delete':
                console.log(String(row.Id));
                
                toDelRow({ ids: String(row.Id) })
            .then((result) => {
                
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });





                break;
            default:
        }
        
    }


   

    get options() {
        return [
            { label: 5, value: 5 },
            { label: 10, value: 10 },
            { label: 15, value: 15 },
        ];
    }
   
   loadLabels()
   {
        this.label1=1;
        this.label2=2;
        this.label3=3;
   }
   
    handleChange(event) {
        this.btncolor(1);
        this.currentPage=1;
        this.loadLabels();
        this.value = parseInt(event.detail.value);
        console.log(this.value);
        this.datatoShow=this.results.slice(0,this.value);
        this.totalPages=Math.ceil(this.dataLength/this.value);
        this.valToShow="page "+this.currentPage+" of "+this.totalPages;

    }
    delSelected()
    {
        console.log(this.draftValues);
        delSelected({ myData: this.draftValues })
            .then((result) => {
                
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });
    }
    yourData=[]
    sObjects() {
       this.yourData=[];
       console.log('entered');
       console.log(this.currentSObjects);
        for(var i=0;i<this.currentSObjects.length;i++)
       {
        //console.log(this.currentSObjects[i]);  
       this.yourData.push( { label: this.currentSObjects[i], value: this.currentSObjects[i] });
       }
       console.log('getting sobjects');
       console.log(this.yourData);
        //return this.yourData;
    }




    openSelect() {
        // to open modal set isModalOpen tarck value as true
        this.showSelect = true;
        console.log('true ho gya');
    }
    okSelect() {
        // to close modal set isModalOpen tarck value as false
        this.showSelect = false;
        var tempList=this.tabs;
        console.log(tempList);
        this.tabs=[];
        for(var i=0;i<tempList.length-1;i++)
        {
           this.tabs.push(tempList[i]); 
        }

        this.tabs.push({
            value: this.val,
            label: this.val,
         
        });
        this.tabs.push({
                        value: `more`,
                        label: `more`,
                     
                    });

        this.searchKey=this.val;
        this.handleLoad();

        
    }
    closeSelect() {
        // to close modal set isModalOpen tarck value as false
        this.showSelect = false;
    }
    handleChange2(event) {
        this.val = event.detail.value;
        
        console.log(this.val);
    }

    tempMethod()
    {
        toCheck({ objectType: this.searchKey })
            .then((result) => {
                
                console.log(result);
                console.log(Object.getOwnPropertyNames(result[0]));

                console.log('tempMethod ended');
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.contacts = undefined;
            });
    }
    
    
    


    @track currentButton1;
    moveRight()
    {
        console.log('right clicked');
        if(this.label3<this.totalPages)
        {
            console.log('right true')
            this.label1++;
            this.label2++;
            this.label3++;
            console.log(this.label1);
        }
        this.btncolor(this.currentButton1);
    }
   

    moveLeft()
    {
        console.log('right clicked');
        if(this.label1>1)
        {
            this.label1--;
            this.label2--;
            this.label3--;
        }
        this.btncolor(this.currentButton1);
    }
    buttonClick(event)
    {
        console.log(event.target.label);
        
        this.pagination(event.target.label);
        if(event.target.label<=this.totalPages)
        {
        this.btncolor(event.target.label);
        this.currentButton1=event.target.label;
        }
    }

    pagination(val)
    {
        if(val<=this.totalPages)
        {
            this.currentPage=val;
            console.log(parseInt((val-1)*this.value)+"to "+(parseInt((val-1)*this.value)+parseInt(this.value-1)));
            this.datatoShow=this.results.slice(parseInt((val-1)*this.value),(parseInt((val-1)*this.value)+parseInt(this.value)));
            this.valToShow="page "+this.currentPage+" of "+this.totalPages


        }
        
    }
    

    @track variant1="neutral";
    @track variant2="neutral";
    @track variant3="neutral";
    btncolor(val)
    {
        if(val==this.label1)
        {
            this.variant1="brand";
            this.variant2="neutral";
            this.variant3="neutral";
        }
        else if(val==this.label2)
        {
            this.variant1="neutral";
            this.variant2="brand";
            this.variant3="neutral";
        }
        else if(val==this.label3)
        {
            this.variant1="neutral";
            this.variant2="neutral";
            this.variant3="brand";
        }
        else
        {
            this.variant1="neutral";
            this.variant2="neutral";
            this.variant3="neutral";
        }

    }
    clearButtonform()
    {
        this.variant1="neutral";
        this.variant2="neutral";
        this.variant3="neutral";
    }
    handleEditSave(event)
    {

       event.preventDefault();

       this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);

       this.editForm = false;

       this.dispatchEvent(new ShowToastEvent({
           title: 'Success!!',
           message: this.typee+' Update Successfull',
           variant: 'success'
       }),);
    }


  

}