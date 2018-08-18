<?php
namespace App\Entity;

class Model 
{
    /**
	Ideally I would have a model I could extend for such methods as getAll but it looks like doctrine isn't going to play nice
    */

	//wish i could make this work!
    public static function getAll()
    {
		
		//$class= __CLASS__;
		//this doesn't work because of compile-time issues
        //$entities = $this->getDoctrine()->getRepository(getClass(self))->findAll();
	
        //return $this;
    }

}
