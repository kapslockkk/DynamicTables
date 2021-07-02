public with sharing class getAllDatas {
   @AuraEnabled
   public static List<SObject> takData(String str)
   {
    return Database.query('SELECT FIELDS(STANDARD) FROM '+str);
   }
   @AuraEnabled
   public static void toDelRow(String ids)
   {
        Id idss=Id.valueOf(ids);
        System.debug(idss);


        List<Id>idList=new List<Id>();
        idList.add(idss);
    String SobjectApiName=idss.getSObjectType().getDescribe().getName();  
    String query = 'select ' + 'id' + ' from ' + SobjectApiName +' where id IN: idList ';  

    System.debug(Database.query(query));
   // List<SObject>tempData=Database.query('SELECT FIELDS(STANDARD) FROM '+str+'Where Id=: idss');
    delete Database.query(query);
   }
   @AuraEnabled
   public static void delSelected(List<SObject>myData)
   {
    System.debug(myData);
    delete myData;
   }
   @AuraEnabled
   public static List<String> getSobjects()
   {
      Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe(); 
      List<String>retData=new List<String>();
      
      for(SObjectType str :gd.Values())
      {
      // retData.add(str.toUpperCase());
      retData.add(String.valueOf(str));
      }
     // retData.adAll(gd.keySet());
      return retData;
   }
   @AuraEnabled
   public static List<SObject> toCheck(String objectType){
     // String objectType='Account';
   SObjectType sObjType = ((SObject) Type.forName(objectType).newInstance()).getSObjectType();
        DescribeSObjectResult describeResult = sObjType.getDescribe();

        List<String> fields = new List<String>( describeResult.fields.getMap().keySet() );

        String query =' SELECT ' +String.join( fields, ',' ) +' FROM ' +describeResult.getName();
        List<SObject> newData = Database.query( query );
        System.debug( newData);
        return newData;
   }

   @AuraEnabled
   public static List<String> getEditableFields(String objectType)
   {
       Map<String, Schema.SObjectField> oppFields = Schema.getGlobalDescribe().get(objectType).getDescribe().fields.getMap();
       
       list<string> editableFields = new list<string> ();
       
       for(schema.SObjectField editfieds :oppFields.values()){
           
       schema.DescribeFieldResult fieldResult = editfieds.getDescribe();
           
           if(fieldResult.isUpdateable()){
               
               editableFields.add(fieldResult.getName());
               
               List <String> oppList = new List<String>(editableFields);
           
               }
           }
           system.debug(editableFields);
           return editableFields;    
   }



//    String objectType='Account';
// List<String> fieldNameList=new List<String>();
//         map<string,schema.sobjecttype> describe = schema.getglobaldescribe();
//         if(describe.containskey(objectType)) {
//             map<string,schema.sobjectfield> fieldmap = describe.get(objectType).getdescribe().fields.getmap();
            
//             System.debug(fieldmap.values());
}
